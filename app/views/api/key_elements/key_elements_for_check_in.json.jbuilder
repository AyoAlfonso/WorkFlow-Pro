json.array! @quarterly_goal_key_elements do |key_element|
  json.partial! key_element, partial: "api/key_elements/key_element", as: :key_element
end

json.array! @subinitiative_key_elements do |key_element|
  json.partial! key_element, partial: "api/key_elements/key_element", as: :key_element
end

json.array! @annualInitiative_key_elements do |key_element|
  json.partial! key_element, partial: "api/key_elements/key_element", as: :key_element
end