Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000', 'https://lynchpyn-qa.herokuapp.com', 'https://lynchpyn.herokuapp.com', 'https://lynchpyn.com', 'https://app.lynchpyn.com', 'https://qa-app.lynchpyn.com'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end