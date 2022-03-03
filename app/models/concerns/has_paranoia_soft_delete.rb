
module HasParanoiaSoftDelete
#  acts_as_paranoid column: :destroyed_at
# // we are using destroyed_at because some models are already using deleted_at e.g User, deleted by the team model, and finally destroyed_at 

end
