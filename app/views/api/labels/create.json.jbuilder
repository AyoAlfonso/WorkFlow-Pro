json.new_label do
  json.partial! partial: "api/labels/label", label: @label
end
json.labels @labels do |label|
  json.partial! partial: "api/labels/label", label: label
end