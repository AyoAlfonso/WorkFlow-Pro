json.array! @issues do |issue|
  json.partial! 'api/issues/issue', issue: issue
end