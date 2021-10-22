class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@lynchpyn.com"
  layout "mailer"
  helper :application
end
