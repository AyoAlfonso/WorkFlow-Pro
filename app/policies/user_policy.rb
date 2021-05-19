class UserPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    #TODO: coach can see this
    user_is_part_of_current_company?
  end

  def create?
    true #TODO: ASK CHRIS IF THIS IS THE RIGHT SCOPE, WHICH CASE WAS THIS NOT TRUE FOR, WAS THIS FOR ONBOARDING?
  end

  def update?
    @record == @user || user_is_company_admin_of_current_company?
  end

  def destroy? #only company admin can destroy, and destroy is a soft delete in this case
    user_is_company_admin_of_current_company?
  end

  def resend_invitation?
    create?
  end

  def reset_password?
    @record == @user
  end

  def invite_users_to_company?
    user_is_company_admin_of_current_company?
  end

  # TODO: Needs logic here
  def update_avatar?
    record == user
  end

  def delete_avatar?
    update_avatar?
  end

  def update_team_role?
    user_is_company_admin_of_current_company?
  end

  def update_company_first_time_access?
    true
  end

  def create_or_update_onboarding_team?
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
      scope.joins(:user_company_enablements).includes([:default_selected_company, avatar_attachment: :blob]).where(user_company_enablements: {company: @company})
    end
  end
end