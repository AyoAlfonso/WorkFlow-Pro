class CompanyPolicy < ApplicationPolicy

  def show?
    user.company == record
  end

  def update?
    user.company == record && user.company_admin? #current_admin_user.present?
  end

  def delete_logo?
    update?
  end
end