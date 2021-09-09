class PabblySubscriptionService
  attr_accessor :connection

  def initialize
    @connection = Faraday.new("https://payments.pabbly.com/api/v1/") do |conn|
      conn.adapter Faraday.default_adapter
      conn.basic_auth(ENV["PABBLY_API_KEY"], ENV["PABBLY_SECRET_KEY"])
    end
  end

  def get_all_subscriptions
    api_get("customers")
  end

  def get_subscriptions(company_id) #company_id in our database
    company = Company.find(company_id)
    if company.customer_subscription_profile_id.present?
      api_get("customer/#{company.customer_subscription_profile_id}")
    else
      raise "The company does not have a subscription account yet."
    end
  end

  def get_customer(customer_id)
    api_get("customer/#{customer_id}")
  end

  def delete_customer(user_id)
    user = User.find(user_id)
    api_delete("customers/#{user.customer_subscription_profile_id}")
    user.update!(customer_subscription_profile_id: nil)
  end

  private

  def api_get(url)
    response = @connection.get do |req|
      req.headers["Content-Type"] = "application/json"
      req.url url
    end
    parse_results(response)
  end

  def api_post(url, body = nil)
    response = @connection.post do |req|
      req.url url
      req.headers["Content-Type"] = "application/json"
      req.body = body.to_json if body.present?
    end
    parse_results(response)
  end

  def api_delete(url)
    response = @connection.delete do |req|
      req.url url
      req.headers["Content-Type"] = "application/json"
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
