class ApplicationPolicy
  attr_reader :user, :company, :record

  def initialize(context, record)
    @user = context.user
    @company = context.company
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  ##helpers
  def user_is_part_of_this_company?(company)
    enablement = @user.user_company_enablements.find_by_company_id(company.id)
    enablement.present? && enablement&.user_role&.name != UserRole::COACH
  end

  def user_is_company_admin_of_this_company?(company)
    # (user.companies.include? record) && (["CEO", "Admin"].include? UserCompanyEnablement.find_by(company_id: record.id).user_role.name)
    # above left line is implicit
    # (["CEO", "Admin"].include? UserCompanyEnablement.find_by(company_id: record.id).user_role.name)
    @user.company_admin?(company)
  end

  def user_is_part_of_current_company?
    user_is_part_of_this_company?(@company)
  end

  def user_is_company_admin_of_current_company?
    user_is_company_admin_of_this_company?(@company)
  end

  def user_can_observe_company?(company)
    @user.can_observe_company?(company)
  end

  def user_can_observe_current_company?
    user_can_observe_company?(@company)
  end

  class Scope
    attr_reader :user, :company, :scope

    def initialize(context, scope)
      @user = context.user
      @company = context.company
      @scope = scope
    end

    def resolve
      scope.none
    end
  end
end
