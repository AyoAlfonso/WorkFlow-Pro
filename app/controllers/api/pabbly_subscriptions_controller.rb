class Api::PabblySubscriptionsController < Api::ApplicationController
 
  respond_to :json

  def create_company_and_user
     binding.pry

     render json: { result: true }


  end
end
