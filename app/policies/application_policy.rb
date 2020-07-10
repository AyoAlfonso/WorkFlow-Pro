class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    @user.user_role.name == "ceo" ? true : false
  end

  def show?
    @user.user_role.name == "ceo" ? true : false
  end

  def create?
    @user.user_role.name == "ceo" ? true : false
  end

  def new?
    create?
  end

  def update?
    @user.user_role.name == "ceo" ? true : false
  end

  def edit?
    update?
  end

  def destroy?
    @user.user_role.name == "ceo" ? true : false
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.all
    end
  end
end
