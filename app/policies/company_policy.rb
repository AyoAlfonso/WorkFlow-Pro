class CompanyPolicy < ApplicationPolicy

  def show?
    user.company == record
  end

  def update?
    user.company == record && (user.role == UserRole::CEO || user.role == UserRole::ADMIN) #current_admin_user.present?
  end
end