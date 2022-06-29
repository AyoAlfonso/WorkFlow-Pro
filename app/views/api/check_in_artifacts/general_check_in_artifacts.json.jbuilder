json.array! @check_in_artifacts_for_month do |artifact|
  json.partial! artifact, partial: "api/check_in_artifacts/check_in_artifact", as: :check_in_artifact
end

json.array! @check_in_artifacts_for_week do |artifact|
  json.partial! artifact, partial: "api/check_in_artifacts/check_in_artifact", as: :check_in_artifact
end

json.array! @check_in_artifacts_for_day do |artifact|
  json.partial! artifact, partial: "api/check_in_artifacts/check_in_artifact", as: :check_in_artifact
end