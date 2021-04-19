class JournalEntryPolicy < ApplicationPolicy
  #nobody but the users themselves can access journal entries
  def index?
    true
  end

  def create?
    @user == @record.user && !user_can_observe_current_company?
  end

  def show?
    @user == @record.user
  end

  def update?
    @user == @record.user
  end

  def destroy?
    @user == @record.user
  end


  class Scope
    attr_reader :user, :scope

    def initialize(context, scope)
      @user = context.user
      @scope = scope
    end

    def resolve
      scope.for_user(@user)
    end
  end
end