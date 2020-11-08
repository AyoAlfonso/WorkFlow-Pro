class UserPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    true
  end

  def show?
    @user.company == @record.company
  end

  def create?
    @user.company == @record.company && (@user.company_admin? && @user.company == @record.company) #current_admin_user.present?
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

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.includes([:company, :user_role, avatar_attachment: :blob]).where(company: @user.company)
    end
  end
end