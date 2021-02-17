class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    @user.companies.pluck(:id).include?(@record.default_selected_company_id)
  end

  def create?
    true
  end

  def update?
    @record == @user || (@user.company_admin? && @user.company == @record.company)
  end

  def destroy? #only company admin can destroy, and destroy is a soft delete in this case
    @user.company_admin? && @user.company == @record.company
  end

  def resend_invitation?
    create?
  end

  def reset_password?
    true
  end

  # TODO: Needs logic here
  def update_avatar?
    record == user
  end

  def delete_avatar?
    update_avatar?
  end

  def update_team_role?
    true
  end

  def update_company_first_time_access?
    true
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.joins(:user_company_enablements).includes([:company, :user_role, avatar_attachment: :blob]).where(user_company_enablements: {company: @company})
    end
  end
end