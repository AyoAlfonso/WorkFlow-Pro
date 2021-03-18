class CompanyPolicy < ApplicationPolicy

  def create?
    true
  end

  def show?
    user_is_part_of_this_company?(record)
  end

  def update?
    user_is_company_admin_of_this_company?(record)
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