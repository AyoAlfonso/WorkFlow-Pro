class StaticDataService < ApplicationService

  def call
    { "time_zones": time_zones, "headings_and_descriptions": headings_and_descriptions, "fields_and_labels": fields_and_labels }
  end

  def time_zones
    ActiveSupport::TimeZone.all.uniq(&:utc_offset).sort.map &:to_s
  end

  def fields_and_labels
    {
      "0": {
        fields: [
          {label: "Business Name", key: "name"},
          {label: "Logo (preferably horizontal logos)", key: "logo"},
          {label: "Timezone", key: "timezone"},
          {label: "Fiscal Year Start", key: "fiscal_year_start"},
          {label: "Why did you decide to sign up for LynchPyn?", key: "sign_up_purpose"}
        ]
      },
      "1": {
        fields: [
          {label: "Why does {company_name} exist?", key: "core_1"},
          {label: "How do {company_name} employees and leaders behave? (AKA your core values)", key: "core_2"},
          {label: "What does {company_name} do?", key: "core_3"},
          {label: "What sets {company_name} apart from the rest?", key: "core_4"}
        ]
      },
      "2": {
        fields: [
          {label: "What's the most important thing your company has to achieve in the upcoming year?", key: "rallying_cry"},
          {label: "What's a specific Goal you can set for the next year to achieve your LynchPyn Goal? This can be specific to your team.", key: "annual_initiative"},
          {label: 'What would be an Initiative you can take on this quarter towards "${annual_initiative}"?', key: "quarterly_goal"},
          {label: 'What would be an achievable milestone for this week to move you closer to "{quarterly_goal}?"', key: "milestone"},
        ]
      },
      "3": {
        fields: [
          {label: "", key: "key_activity"}
        ]
      },
      "4": {
        fields: [
          {label: "What team do you belong to? (pick one, you can add others later)", key: "team"},
          {label: "Other Members", key: "other_members"}
        ]
      }
    }
  end

  def headings_and_descriptions
    # @TODO this eventually should be generated from Active Admin so it can be edited and not hard-coded here
    {
      "0": {
        heading: "Welcome!",
        description: "Add some basic info about your company so we can set up an instance of Lynchpyn for you.",
        stepLabel: "Tell us more about yourself"
      },
      "1": {
        heading: "Foundational Four™",
        description: "Tell us more about your company.  If you don't have all the answers, enter as much as possible and continue.  You can also skip if you want to do this later.",
        stepLabel: "Your company's Foundation Four \u2122"
      },
      "2": {
        heading: "Goals",
        description: "Goals are thjings you (and your company) want to achieve in the next 3-12 months.  By adding your Goals to Lynchpyn, you can communicate and align your team around what really matters.",
        stepLabel: "Create your first Goal"
      },
      "3": {
        heading: "Pyns™",
        description: "Pyns are the LynchPyn version of to-dos.  Review the Weekly Milestone you just defined; what can you do today towards it?  Add it as a Pyn.",
        stepLabel: "Add your first Pyn (todo)"
      },
      "4": {
        heading: "Team",
        descriptiion: "Final step in your onboarding is adding your team.  The power of Lynchpyn is in collaboration; add your team and teammates so they can help you populate your company Goals.",
        stepLabel: "Add your Team"
      }
    }
  end
end