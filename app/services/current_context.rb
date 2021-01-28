class CurrentContext
  attr_reader :user, :company

  def initialize(user, company)
    @user = user
    @company = company
  end
end
