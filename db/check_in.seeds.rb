  pdmt = CheckInTemplate.where(check_in_type: :weekly_check_in, name: "Weekly Check In").first_or_initialize
  pdmt.check_in_templates_steps.destroy_all if pdmt.check_in_templates_steps.count > 0
  pdmt.update!(
    check_in_type: :weekly_check_in,
    name: "Weekly Check In",
    check_in_templates_steps_attributes: [
      {
        order_index: 0,
        name: "Milestones",
        step_type: :component,
        instructions: "Provide updates on your Key Results and KPIs to complete this weekly check-in.",
        component_to_render: "WeeklyMilestones",
        duration: nil
      },
      {
        order_index: 1,
        name: "KPI",
        step_type: :component,
        instructions: "Provide updates on your Key Results and KPIs to complete this weekly check-in.",
        component_to_render: "KPI",
        duration: nil
      },
    ],
  )