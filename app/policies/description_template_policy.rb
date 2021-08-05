class DescriptionTemplatePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def update_or_create_templates?
   true
  end

  def destroy?
    user_is_company_admin_of_current_company?
  end
  
  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.owned_by_company(@company)
    end
  end
end
