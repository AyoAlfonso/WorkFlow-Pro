class PabblySubscriptionService
  attr_accessor :connection

  def initialize
    @connection = Faraday.new("https://payments.pabbly.com/api/v1") do |conn|
      conn.adapter Faraday.default_adapter
      conn.basic_auth(ENV['PABBLY_API_KEY'], ENV['PABBLY_SECRET_KEY'])
    end   
  end

  def get_all_customers
    @response = @connection.get do |req|
      req.url '/customers'
      req.headers['Content-Type'] = 'application/json'
    end

    #binding.pry

    #JSON.parse @response.env.body
  end
end


# conn = Faraday.new('https://payments.pabbly.com/api/v1')
# conn.basic_auth(ENV['PABBLY_API_KEY'], ENV['PABBLY_SECRET_KEY'])
# conn.get('/customers')