class CustomDeviseMailer < Devise::Mailer
  def invitation_instructions(record, token, opts={})
    opts[:from] = "LynchPyn <no-reply@lynchpyn.com>"
    opts[:subject] = "Invitation to join #{Company.find(record.company_id).name} on LynchPyn"
    super
  end
end