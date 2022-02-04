json.extract! key_element, :id, :value, :completed_at, :elementable_type, :elementable_id, :completion_type, :completion_current_value, :completion_target_value, :completion_starting_value, :status, :owned_by_id, :owned_by, :greater_than
json.elementable_context_description key_element.elementable_data["description"]
json.elementable_owned_by key_element.elementable_data["owned_by_id"]
json.objective_logs key_element.objective_logs
