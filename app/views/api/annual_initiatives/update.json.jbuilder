json.annual_initiative do
  json.partial! @annual_initiative, partial: "api/annual_initiatives/annual_initiative", as: :annual_initiative
end
