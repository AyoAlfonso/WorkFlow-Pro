class CompanyPolicy < ApplicationPolicy

  def show?
    user.companies.pluck(:id).include?(record.id)
  end

  def update?
    user.company == record && user.company_admin? #current_admin_user.present?
  end

  def delete_logo?
    update?
  end

  def update_logo?
    update?
  end
end