class UpdateRoleNames < ActiveRecord::Migration[6.0]
  def up
    UserRole.where(name: "normal_user").update_all(name: "Employee")
    UserRole.where(name: "leadership").update_all(name: "Leadership Team")
    UserRole.where(name: "ceo").update_all(name: "CEO")
    UserRole.where(name: "admin").update_all(name: "Admin")
  end

  def down
    UserRole.where(name: "Employee").update_all(name: "normal_user")
    UserRole.where(name: "Leadership Team").update_all(name: "leadership")
    UserRole.where(name: "CEO").update_all(name: "ceo")
    UserRole.where(name: "Admin").update_all(name: "admin")
  end
end