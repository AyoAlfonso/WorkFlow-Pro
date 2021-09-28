# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
ur1 = UserRole.where(name: UserRole::CEO).first_or_create(name: UserRole::CEO)
ur2 = UserRole.where(name: UserRole::ADMIN).first_or_create(name: UserRole::ADMIN)
ur3 = UserRole.where(name: UserRole::NORMAL).first_or_create(name: UserRole::NORMAL)
ur4 = UserRole.where(name: UserRole::LEADERSHIP).first_or_create(name: UserRole::LEADERSHIP)
ur5 = UserRole.where(name: UserRole::COACH).first_or_create(name: UserRole::COACH)

c2 = Company.where(name: "LynchPyn").first_or_create(name: 'LynchPyn', address: 'Toronto', contact_email: 'parham@lynchpyn.com', phone_number: '647-631-1996', rallying_cry: 'LynchPyn Goal!', fiscal_year_start: Date.new(2020,01,01), timezone: "(GMT-05:00) Eastern Time (US & Canada)")
CoreFour.where(company: c2).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company_id: c2.id)
User.where(email: "parham@lynchpyn.com").first_or_create!(first_name: 'Parham', last_name: 'Chinikar', email: 'parham@lynchpyn.com', phone_number: '647-631-1996', password: 'password', password_confirmation: 'password', company_id: c2.id, user_role_id: ur2.id, title: "CPO", default_selected_company_id: c2.id)

if Rails.env.development?
  c1 = Company.where(name: "Latero Labs").first_or_create(name: 'Latero Labs', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'LynchPyn Goal!', fiscal_year_start: Date.new(2020,01,01), timezone: "(GMT-08:00) Pacific Time (US & Canada)")
  CoreFour.where(company: c1).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company: c1)
  c3 = Company.where(name: "Latero Labs Forum").first_or_create(name: 'Latero Labs Forum', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'LynchPyn Goal!', fiscal_year_start: Date.new(2020,01,01), timezone: "(GMT-08:00) Pacific Time (US & Canada)", display_format: 1)
  CoreFour.where(company: c3).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company: c3)

  t1 = Team.where(name: "Development Team").first_or_create(name: "Development Team", company_id: c1.id)
  t2 = Team.where(name: "Team 2").first_or_create(name: "Team 2", company_id: c1.id)
  t3 = Team.where(name: "Team 3").first_or_create(name: "Team 3", company_id: c3.id)

  AdminUser.where(email: "admin@example.com").first_or_create(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
  u1 = User.where(email: "sunny@laterolabs.com").first_or_create(first_name: 'Sunny', last_name: 'To', email: 'sunny@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur1.id, title: "Placeholder", default_selected_company_id: c1.id)
  u2 = User.where(email: "christopher@laterolabs.com").first_or_create(first_name: 'Christopher', last_name: 'Pang', email: 'christopher@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id, title: "Placeholder", default_selected_company_id: c1.id)
  u3 = User.where(email: "kyle@laterolabs.com").first_or_create(first_name: 'Kyle', last_name: 'So', email: 'kyle@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur4.id, title: "Placeholder", default_selected_company_id: c1.id)
  u4 = User.where(email: "derek@laterolabs.com").first_or_create(first_name: 'Derek', last_name: 'Yau', email: 'derek@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur1.id, title: "Placeholder", default_selected_company_id: c1.id)
  u5 = User.where(email: "laurel@laterolabs.com").first_or_create(first_name: 'Laurel', last_name: 'Olsen', email: 'laurel@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id, title: "Placeholder", default_selected_company_id: c1.id)
  u6 = User.where(email: "jeremy@laterolabs.com").first_or_create(first_name: 'Jeremy', last_name: 'Paterson', email: 'jeremy@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id, title: "Placeholder", default_selected_company_id: c1.id)
  u7 = User.where(email: "allen@laterolabs.com").first_or_create(first_name: 'Allen', last_name: 'Greer', email: 'allen@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id, title: "Placeholder", default_selected_company_id: c1.id)
  u8 = User.where(email: "shaun@laterolabs.com").first_or_create(first_name: 'Shaun', last_name: 'Schwartz', email: 'shaun@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id, title: "Placeholder", default_selected_company_id: c1.id)
  u9 = User.where(email: "mani@laterolabs.com").first_or_create(first_name: 'Mani', last_name: 'Jafari', email: 'mani@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id, title: "Placeholder", default_selected_company_id: c1.id)

  TeamUserEnablement.where(user_id: u1.id).first_or_create(team_id: t1.id, user_id: u1.id, role: "team_lead")
  TeamUserEnablement.where(user_id: u2.id).first_or_create(team_id: t1.id, user_id: u2.id, role: "team_member")
  TeamUserEnablement.where(user_id: u3.id).first_or_create(team_id: t1.id, user_id: u3.id, role: "team_member")
  TeamUserEnablement.where(user_id: u4.id).first_or_create(team_id: t2.id, user_id: u4.id, role: "team_lead")
  TeamUserEnablement.where(user_id: u5.id).first_or_create(team_id: t2.id, user_id: u5.id, role: "team_member")
  TeamUserEnablement.where(user_id: u6.id).first_or_create(team_id: t2.id, user_id: u6.id, role: "team_member")
  TeamUserEnablement.where(user_id: u7.id).first_or_create(team_id: t2.id, user_id: u7.id, role: "team_member")
  TeamUserEnablement.where(user_id: u8.id).first_or_create(team_id: t2.id, user_id: u8.id, role: "team_member")
  TeamUserEnablement.where(user_id: u9.id).first_or_create(team_id: t1.id, user_id: u9.id, role: "team_member")

  UserCompanyEnablement.where(user_id: u1.id).first_or_create(user_id: u1.id, company_id: c1.id, user_role_id: ur1.id)
  UserCompanyEnablement.where(user_id: u2.id).first_or_create(user_id: u2.id, company_id: c1.id, user_role_id: ur2.id)
  UserCompanyEnablement.where(user_id: u3.id).first_or_create(user_id: u3.id, company_id: c1.id, user_role_id: ur4.id)
  UserCompanyEnablement.where(user_id: u4.id).first_or_create(user_id: u4.id, company_id: c1.id, user_role_id: ur1.id)
  UserCompanyEnablement.where(user_id: u5.id).first_or_create(user_id: u5.id, company_id: c1.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u6.id).first_or_create(user_id: u6.id, company_id: c1.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u7.id).first_or_create(user_id: u7.id, company_id: c1.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u8.id).first_or_create(user_id: u8.id, company_id: c1.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u9.id).first_or_create(user_id: u9.id, company_id: c1.id, user_role_id: ur2.id)

  UserCompanyEnablement.where(user_id: u1.id).first_or_create(user_id: u1.id, company_id: c3.id, user_role_id: ur1.id)
  UserCompanyEnablement.where(user_id: u2.id).first_or_create(user_id: u2.id, company_id: c3.id, user_role_id: ur2.id)
  UserCompanyEnablement.where(user_id: u3.id).first_or_create(user_id: u3.id, company_id: c3.id, user_role_id: ur4.id)
  UserCompanyEnablement.where(user_id: u4.id).first_or_create(user_id: u4.id, company_id: c3.id, user_role_id: ur1.id)
  UserCompanyEnablement.where(user_id: u5.id).first_or_create(user_id: u5.id, company_id: c3.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u6.id).first_or_create(user_id: u6.id, company_id: c3.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u7.id).first_or_create(user_id: u7.id, company_id: c3.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u8.id).first_or_create(user_id: u8.id, company_id: c3.id, user_role_id: ur3.id)
  UserCompanyEnablement.where(user_id: u9.id).first_or_create(user_id: u9.id, company_id: c3.id, user_role_id: ur2.id)
  
  pdmt = CheckInTemplate.where(check_in_type: :weekly_check_in, name: "Weekly Check In").first_or_initialize
  pdmt.check_in_templates_steps.destroy_all if pdmt.check_in_templates_steps.count > 0
  pdmt.update!(
    check_in_type: :weekly_check_in,
    name: "Weekly Check In",
    check_in_templates_steps_attributes: [
      {
        order_index: 0,
        name: "Key Results",
        step_type: :component,
        instructions: "Provide updates on your Key Results and KPIs to complete this weekly check-in.",
        component_to_render: "KeyResults",
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

  ai_1 = AnnualInitiative.where(description: "Purchase company vehicles for transportation").first_or_create(
    company_id: c1.id, 
    created_by_id: u1.id, 
    owned_by_id: u1.id, 
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Purchase company vehicles for transportation", 
    key_elements_attributes: [{value: "Check out Toyota"}, {value: "Check out Mercedes Benz"}],
    context_description: "Choose a nice fleet!",
    fiscal_year: 2022
  )

  qg1 = QuarterlyGoal.where(description: "Visit Toyota Dealerships").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u1.id,
    annual_initiative_id: ai_1.id,
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Visit Toyota Dealerships",
    context_description: "Check out the SUVs",
    quarter: 1,
  )

  m1 = Milestone.where(description: "Get brochures and pricing", milestoneable: qg1).first_or_create(
    created_by_id: u1.id, 
    description: "Get brochures and pricing", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg1,
    week_of: "2020-07-16"
  )

  m2 = Milestone.where(description: "Test drive the vehicles", milestoneable: qg1).first_or_create(
    created_by_id: u1.id, 
    description: "Test drive the vehicles", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg1,
    week_of: "2020-07-23"
  )

  qg2 = QuarterlyGoal.where(description: "Visit Mercedes Benz Dealerships").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u2.id,
    annual_initiative_id: ai_1.id,
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Visit Mercedes Benz Dealerships",
    context_description: "Check out the SUVs",
    quarter: 1
  )

  m3 = Milestone.where(description: "Get brochures and pricing", milestoneable: qg2).first_or_create(
    created_by_id: u1.id, 
    description: "Get brochures and pricing", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg2,
    week_of: "2020-07-16"
  )

  m4 = Milestone.where(description: "Test drive the vehicles", milestoneable: qg2).first_or_create(
    created_by_id: u1.id, 
    description: "Test drive the vehicles", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg2,
    week_of: "2020-07-23"
  )

  ai_2 = AnnualInitiative.where(description: "Find a good city to expand our office").first_or_create(
    company_id: c1.id, 
    created_by_id: u1.id, 
    owned_by_id: u2.id, 
    importance: ["More people can work for us", "Won't be able to maximize our profits", "Throw a huge party!"], 
    description: "Find a good city to expand our office", 
    key_elements_attributes: [{value: "Research Kelowna"}, {value: "Research Edmonton"}],
    context_description: "Find a good city!",
    fiscal_year: 2022
  )

  qg3 = QuarterlyGoal.where(description: "Fly to Kelowna and do some research").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u2.id,
    annual_initiative_id: ai_2.id,
    importance: ["More people can work for us", "Won't be able to maximize our profits", "Throw a huge party!"], 
    description: "Fly to Kelowna and do some research",
    context_description: "See if there are any nice offices",
    quarter: 1
  )

  m5 = Milestone.where(description: "Accessbility of the city", milestoneable: qg3).first_or_create(
    created_by_id: u1.id, 
    description: "Accessbility of the city", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg3,
    week_of: "2020-07-16"
  )

  m6 = Milestone.where(description: "Number of good restaurants", milestoneable: qg3).first_or_create(
    created_by_id: u1.id, 
    description: "Number of good restaurants", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    milestoneable: qg3,
    week_of: "2020-07-23"
  )
  
  c1.users.each{|u| u.confirm}

  # KPI seeding
  k1 = KeyPerformanceIndicator.where(owned_by_id: c1.id, description: "Booked Work").first_or_create(
    title: "Important_KPI",
    created_by: u2,
    owned_by_id: u2.id,
    target_value: 500,
    viewers: [
    {
        "id": "2",
        "type": "team"
    },
    {
        "id": "2",
        "type": "user"
    }
    ],
    unit_type: 2,
    description: "Booked Work",
    greater_than: true
  )
  k2 = KeyPerformanceIndicator.where(owned_by_id: c1.id, description: "Variance in Salaries").first_or_create(
    title: "Important_KPI",
    created_by: u1,
    owned_by_id: u1.id,
    viewers: [
    {
        "id": "2",
        "type": "team"
    },
    {
        "id": "2",
        "type": "user"
    }
    ],
    unit_type: 0,
    description: "Variance in Salaries",
    greater_than: false,
    target_value: 3
  )
  scores1 = [4500, 3000, 4600, 3900, 5200, 4800, 5100, 4700, 4800, 5200, 5300, 5000]
  scores2 = [0, 1, 0, 3, 5, 0, 0, 2, 4, 2, 1, 0, 1]
  wk = c1.current_fiscal_week
  scores1.each do |s|
    ScorecardLog.where(week: wk, key_performance_indicator_id: k1.id).first_or_create(
      user_id: u1.id,
      week: wk,
      score: s,
      fiscal_quarter: c1.current_fiscal_quarter,
      fiscal_year: c1.current_fiscal_year,
      key_performance_indicator_id: k1.id
    )
    wk = wk - 1
    if wk == 0 then
      break
    end
  end
  wk = c1.current_fiscal_week
  scores2.each do |s|
    ScorecardLog.where(week: wk, key_performance_indicator_id: k2.id).first_or_create(
      user_id: u1.id,
      week: wk,
      score: s,
      fiscal_quarter: c1.current_fiscal_quarter,
      fiscal_year: c1.current_fiscal_year,
      key_performance_indicator_id: k2.id
    )
    wk = wk - 1
    if wk == 0 then
      break
    end
  end
end


StaticData.where(field: "forum_introduction").first_or_create(value: "")

["Today", "Tomorrow", "Weekly List", "Backlog"].each do |group|
  ScheduledGroup.where(name: group).first_or_create
end


Dir[File.join(Rails.root, 'db', '*.seeds.rb')].sort.each do |seed|
  load seed
end

