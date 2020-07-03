class CompanyPolicy < ApplicationPolicy

  def show?
    user.company == record
  end

  def update?
    current_admin_user.present?
  end
end