class Integrations::PabblySubscriptionsController < Integrations::ApplicationController
  include ActionController::HttpAuthentication::Basic::ControllerMethods
  http_basic_authenticate_with name: ENV["INTEGRATION_USERNAME"], password: ENV["INTEGRATION_PASSWORD"]
  respond_to :json

  def create_company_and_user

    if params[:event_name] == "test_webhook_url"
      render json: { message: "testing success"} 
    else
      customer_profile = PabblySubscriptionService.new.get_customer(params[:data][:customer_id])
      if customer_profile.blank? || customer_profile["status"] != "success"
        ExceptionNotifier.notify_exception(nil, data: { params: params} )
        render json: { result: false, message: "There was an error creating your subscription service." }
      else
        # The plan code includes the company type. All the plan codes will be in the format of [company_type]:[plan_name]
        # e.g. forum:monthly_plan_1, company:monthly_plan_2
        begin
          ActiveRecord::Base.transaction do
            company_type = params.dig("data", "plan", "plan_code").split(":")[0]
            company = Company.new({
              display_format: company_type == "company" ? 1 : 0,
              name: customer_profile["data"]["company_name"],
              customer_subscription_profile_id: params[:data][:customer_id],
              timezone: "(GMT-05:00) Eastern Time (US & Canada)",
              fiscal_year_start: Date.new(Date.today.year,01,01)
            })
  
            company.save(validate: false)
  
            if User.find_by_email(customer_profile["data"]["email_id"]).present?
              user = User.find_by_email(customer_profile["data"]["email_id"])
            else
              user = User.new({
                first_name: customer_profile["data"]["first_name"],
                last_name: customer_profile["data"]["last_name"],
                email: customer_profile["data"]["email_id"],
                company_id: company.id,
                default_selected_company_id: company.id,
                title: "",
                password: ENV["DEFAULT_PASSWORD"] || "password"
              })
              user.invite!
            end   
            user.assign_attributes({
              user_company_enablements_attributes: [{
                user_id: user.id,
                company_id: company.id,
                user_title: user.title,
                user_role_id: UserRole.find_by_name("Admin").id
              }],
            })
            user.save(validate: false)
            render json: { result: true }
          end
        rescue => exception
          ExceptionNotifier.notify_exception(exception, data: { params: params })
          render json: { result: false, message: exception.message}
        end
      end
    end
  end
end
