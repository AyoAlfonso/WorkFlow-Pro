class Api::PabblySubscriptionsController < Api::ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :set_current_company
  after_action :verify_authorized, except: [:create_company_and_user]

  respond_to :json

  def create_company_and_user
    customer_profile = PabblySubscriptionService.new.get_customer(params[:data][:customer_id])
    if customer_profile.blank? || customer_profile["status"] != "success"
      render json: { result: false, message: "There was an error creating your subscription service." }
    else
      company_type = params[:data][:plan][:plan_code].split(":")[0]
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
  end
end
