class CompanyPolicy < ApplicationPolicy

  def create?
    true
  end

  def show?
    user.companies.pluck(:id).include?(record.id)
  end

  def update?
    (user.companies.include? record) && (["CEO", "Admin"].include? UserCompanyEnablement.find_by(company_id: record.id).user_role.name)
  end

  def delete_logo?
    update?
  end

  def update_logo?
    update?
  end

  def get_onboarding_company?
    true
  end

  def create_or_update_onboarding_goals?
    true
  end

  def get_onboarding_goals?
    true
  end
    
  def create_or_update_onboarding_key_activities? 
    true
  end

  def get_onboarding_key_activities?
    true
  end

  def create_or_update_onboarding_team?
    true
  end
end