class PabblySubscriptionService
  attr_accessor :connection

  def initialize
    @connection = Faraday.new("https://payments.pabbly.com/api/v1/") do |conn|
      conn.adapter Faraday.default_adapter
      conn.basic_auth(ENV['PABBLY_API_KEY'], ENV['PABBLY_SECRET_KEY'])
    end   
  end

  def get_all_subscriptions
    api_get('customers')
  end

  def get_subscriptions(user_id) #user_id in our database
    user = User.find(user_id)
    if user.customer_subscription_profile_id.present?
      api_get("customer/#{user.customer_subscription_profile_id}")
    else
      raise "The user does not have a customer account yet."
    end
  end

  def create_customer(customer_object, user_id)
    #TODO: PASS IN THE CUSTOMER OBJECT IN THE FUTURE.
    customer_object = {
      first_name: "Christopher",
      last_name: "Pang",
      email_id: "christopher+02@laterolabs.com",
    }
    results = api_post("customer", customer_object)
    user = User.find(user_id)
    user.update!(customer_subscription_profile_id: results&.data&.customer&.id)
  end

  def create_customer_and_subscription(customer_object, user_id, plan_id)
    #TODO: PASS IN THE CUSTOMER OBJECT IN THE FUTURE.
    customer_object = {
      first_name: "Christopher",
      last_name: "Pang",
      email: "christopher+01@laterolabs.com",
      card_number: "4111111111111111",
      month: "11",
      year: "2022",
      cvv: "423",
      plan_id: plan_id || "602c42690a80aa09f2da7c93"
    }.merge(gateway_variables)
    results = api_post("subscription", customer_object)
    user = User.find(user_id)
    user.update!(customer_subscription_profile_id: results&.data&.customer&.id)
  end


  def create_subscription_for_existing_customer(user_id, plan_id)
    user = User.find(user_id)
    #TODO: TAKE OUT PLACEHOLDER PLAN ID IN THE FUTURE
    customer_object = { plan_id: plan_id || "602c42690a80aa09f2da7c93" }.merge(gateway_variables)
    api.post("subscription/#{user.customer_subscription_profile_id}")
  end

  def delete_customer(user_id)
    user = User.find(user_id)
    api_delete("customers/#{user.customer_subscription_profile_id}")
    user.update!(customer_subscription_profile_id: nil)
  end

  def cancel_subscription_for_existing_customer(user_id, cancel_at_end = true)
    user = User.find(user_id)
    cancellation_object = { cancel_at_end: cancel_at_end } #True if you want cancel at the end of subscription or false if you want to cancel immediately.
    api.post("subscription/#{user.customer_subscription_profile_id}/cancel", cancellation_object)
  end


  private
  def api_get(url)
    response = @connection.get do |req|
      req.headers['Content-Type'] = 'application/json'
      req.url url
    end
    parse_results(response)
  end

  def api_post(url, body = nil)
    response = @connection.post do |req|
      req.url url
      req.headers['Content-Type'] = 'application/json'
      req.body = body.to_json if body.present?
    end
    parse_results(response)
  end

  def api_delete(url)
    response = @connection.delete do |req|
      req.url url
      req.headers['Content-Type'] = 'application/json'
    end
    parse_results(response)
  end

  def gateway_variables
    {
      gateway_type: ENV["PABBLY_GATEWAY_TYPE"],
      gateway_id: ENV["PABBLY_GATEWAY_ID"],
    }
  end

  def parse_results(results)
    JSON.parse results.env.body
  end
end
