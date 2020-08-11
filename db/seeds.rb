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

c1 = Company.where(name: "Latero Labs").first_or_create(name: 'Latero Labs', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'Some rallying cry!', fiscal_year_start: Date.new(2020,01,01), timezone: "(GMT-08:00) Pacific Time (US & Canada)")
CoreFour.where(company: c1).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company: c1)

c2 = Company.where(name: "Lynchpyn").first_or_create(name: 'Lynchpyn', address: 'Toronto', contact_email: 'parham@lynchpyn.com', phone_number: '647-631-1996', rallying_cry: 'Some rallying cry!', fiscal_year_start: Date.new(2020,01,01), timezone: "(GMT-05:00) Eastern Time (US & Canada)")
CoreFour.where(company: c2).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company_id: c2.id)
User.create!(first_name: 'Parham', last_name: 'Chinikar', email: 'parham@lynchpyn.com', phone_number: '647-631-1996', password: 'password', password_confirmation: 'password', company_id: c2.id, user_role_id: ur2.id)

if Rails.env.development?
  c1 = Company.where(name: "Latero Labs").first_or_create(name: 'Latero Labs', address: '601-510 W Hastings St, Vancouver, BC V6B 1L8', contact_email: 'inquiries@laterolabs.com', phone_number: '604-933-5091', rallying_cry: 'Some rallying cry!')
  CoreFour.where(company: c1).first_or_create(core_1: 'The First Core', core_2: 'The Second Core', core_3: 'The Third Core', core_4: 'The Fourth Core', company: c1)

  AdminUser.where(email: "admin@example.com").first_or_create(email: 'admin@example.com', password: 'password', password_confirmation: 'password')
  u1 = User.where(email: "sunny@laterolabs.com").first_or_create(first_name: 'Sunny', last_name: 'To', email: 'sunny@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur1.id)
  u2 = User.where(email: "christopher@laterolabs.com").first_or_create(first_name: 'Christopher', last_name: 'Pang', email: 'christopher@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id)
  User.where(email: "kyle@laterolabs.com").first_or_create(first_name: 'Kyle', last_name: 'So', email: 'kyle@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id)
  User.where(email: "derek@laterolabs.com").first_or_create(first_name: 'Derek', last_name: 'Yau', email: 'derek@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur1.id)
  User.where(email: "laurel@laterolabs.com").first_or_create(first_name: 'Laurel', last_name: 'Olsen', email: 'laurel@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id)
  User.where(email: "jeremy@laterolabs.com").first_or_create(first_name: 'Jeremy', last_name: 'Paterson', email: 'jeremy@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur2.id)
  User.where(email: "allen@laterolabs.com").first_or_create(first_name: 'Allen', last_name: 'Greer', email: 'allen@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id)
  User.where(email: "shaun@laterolabs.com").first_or_create(first_name: 'Shaun', last_name: 'Schwartz', email: 'shaun@laterolabs.com', phone_number: '778-998-1234', password: 'password', password_confirmation: 'password', company_id: c1.id, user_role_id: ur3.id)
  
  ai_1 = AnnualInitiative.where(description: "Purchase company vehicles for transportation").first_or_create(
    company_id: c1.id, 
    created_by_id: u1.id, 
    owned_by_id: u1.id, 
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Purchase company vehicles for transportation", 
    key_elements_attributes: [{value: "Check out Toyota"}, {value: "Check out Mercedes Benz"}],
    context_description: "Choose a nice fleet!"
  )

  qg1 = QuarterlyGoal.where(description: "Visit Toyota Dealerships").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u1.id,
    annual_initiative_id: ai_1.id,
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Visit Toyota Dealerships",
    status: 0,
    context_description: "Check out the SUVs",
    quarter: 1
  )

  m1 = Milestone.where(description: "Get brochures and pricing", quarterly_goal_id: qg1.id).first_or_create(
    created_by_id: u1.id, 
    description: "Get brochures and pricing", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg1.id,
    week_of: "2020-07-16"
  )

  m2 = Milestone.where(description: "Test drive the vehicles", quarterly_goal_id: qg1.id).first_or_create(
    created_by_id: u1.id, 
    description: "Test drive the vehicles", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg1.id,
    week_of: "2020-07-23"
  )

  qg2 = QuarterlyGoal.where(description: "Visit Mercedes Benz Dealerships").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u2.id,
    annual_initiative_id: ai_1.id,
    importance: ["So we don't need to use 3rd party services", "We will have to spend a lot more money", "Day off for everyone!"], 
    description: "Visit Mercedes Benz Dealerships",
    status: 0,
    context_description: "Check out the SUVs",
    quarter: 1
  )

  m3 = Milestone.where(description: "Get brochures and pricing", quarterly_goal_id: qg2.id).first_or_create(
    created_by_id: u1.id, 
    description: "Get brochures and pricing", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg2.id,
    week_of: "2020-07-16"
  )

  m4 = Milestone.where(description: "Test drive the vehicles", quarterly_goal_id: qg2.id).first_or_create(
    created_by_id: u1.id, 
    description: "Test drive the vehicles", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg2.id,
    week_of: "2020-07-23"
  )

  ai_2 = AnnualInitiative.where(description: "Find a good city to expand our office").first_or_create(
    company_id: c1.id, 
    created_by_id: u1.id, 
    owned_by_id: u2.id, 
    importance: ["More people can work for us", "Won't be able to maximize our profits", "Throw a huge party!"], 
    description: "Find a good city to expand our office", 
    key_elements_attributes: [{value: "Research Kelowna"}, {value: "Research Edmonton"}],
    context_description: "Find a good city!"
  )

  qg3 = QuarterlyGoal.where(description: "Fly to Kelowna and do some research").first_or_create(
    created_by_id: u1.id, 
    owned_by_id: u2.id,
    annual_initiative_id: ai_2.id,
    importance: ["More people can work for us", "Won't be able to maximize our profits", "Throw a huge party!"], 
    description: "Fly to Kelowna and do some research",
    status: 0,
    context_description: "See if there are any nice offices",
    quarter: 1
  )

  m5 = Milestone.where(description: "Accessbility of the city", quarterly_goal_id: qg2.id).first_or_create(
    created_by_id: u1.id, 
    description: "Accessbility of the city", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg3.id,
    week_of: "2020-07-16"
  )

  m6 = Milestone.where(description: "Number of good restaurants", quarterly_goal_id: qg2.id).first_or_create(
    created_by_id: u1.id, 
    description: "Number of good restaurants", 
    week: Time.now.strftime("%U").to_i, 
    status: 0, 
    quarterly_goal_id: qg3.id,
    week_of: "2020-07-23"
  )
  
  c1.users.each{|u| u.confirm}
end

Questionnaire.where(name: "Create My Day").first_or_create(name: "Create My Day", 
  daily_limit: true,
  steps: [
    {
      id: 1,
      message: "What are you grateful for?",
      trigger: "2"
    },
    {
      id: 2,
      user: true,
      trigger: "3"
    },
    {
      id: 3,
      message:
        "How do you want to feel today? What does your life look like when you are feeling that way?",
      trigger: "4"
    },
    {
      id: 4,
      user: true,
      trigger: "5"
    },
    {
      id: 5,
      message: "What frog will you eat today?",
      trigger: "6"
    },
    {
      id: 6,
      options: [],
      metadata: {
        frog_selector: true,
        trigger: 7
      }
    },
    {
      id: 7,
      message: "What is your daily affirmation today?",
      trigger: "8"
    },
    {
      id: 8,
      user: true,
      trigger: "9"
    },
    {
      id: 9,
      message: "What are your thoughts and reflections for today?",
      trigger: "10"
    },
    {
      id: 10,
      user: true,
      end: true
    }
  ]
)

Questionnaire.where(name: "Thought Challenge").first_or_create(name: "Thought Challenge", 
  daily_limit: false,
  steps: [
    {
      id: 1,
      message: "What negative thoughts do you have?",
      trigger: "2"
    },
    {
      id: 2,
      user: true,
      trigger: "3"
    },
    {
      id: 3,
      message: "Which cognitive distortions apply to you?",
      trigger: "4"
    },
    {
      id: 4,
      options: [
        { value: "All-or-Nothing Thinking", label: "All-or-Nothing Thinking", trigger: "5" },
        { value: "Overgeneralization", label: "Overgeneralization", trigger: "5" },
        { value: "Filtering Out Positives", label: "Filtering Out Positives", trigger: "5" },
        { value: "Jumping to Conclusions", label: "Jumping to Conclusions", trigger: "5" }
      ]
    },
    {
      id: 5,
      message: "How can you challenge your negative thoughts?",
      trigger: "6"
    },
    {
      id: 6,
      user: true,
      trigger: "7"
    },
    {
      id: 7,
      message: "What is another way of interpreting the situation?",
      trigger: "8"
    },
    {
      id: 8,
      user: true,
      trigger: "9"
    },
    {
      id: 9,
      message: "How are you feeling now?",
      trigger: "10"
    },
    {
      id: 10,
      options: [],
      metadata: {
        emotion_selector: true,
        emotions: [
            {icon: "Emotion-D", color: "cautionYellow", value: "Worse than before!", trigger: 12},
            {icon: "Emotion-C", color: "grey60", value: "About the Same", trigger: 13},
            {icon: "Emotion-B", color: "successGreen", value: "Better than before!", trigger: 14}
        ]
      }
    },
    {
      id: 12,
      message: "Sorry to hear that...",
      end: true
    },
    {
      id: 13,
      message: "Got it. You can always try something relaxing and come back to this later.",
      end: true
    },
    {
      id: 14,
      message: "Glad to hear that!",
      end: true
    },
  ]
)

Questionnaire.where(name: "Evening Reflection").first_or_create(name: "Evening Reflection", 
  daily_limit: true,
  steps: [
    {
      id: 1,
      message: "How are you feeling?",
      trigger: "2"
    },
    {
      id: 2,
      options: [],
      metadata: {
        emotion_selector: true,
        emotions: [
          {icon: "Emotion-E", color: "warningRed", value: "Terrible", trigger: 3},
          {icon: "Emotion-D", color: "cautionYellow", value: "Bad", trigger: 3},
          {icon: "Emotion-C", color: "grey60", value: "Okay", trigger: 3},
          {icon: "Emotion-B", color: "successGreen", value: "Good", trigger: 3},
          {icon: "Emotion-A", color: "finePine", value: "Great", trigger: 3}
        ]
      }
    },
    {
      id: 3,
      message: "What did you feel?",
      trigger: "4"
    },
    {
      id: 4,
      user: true,
      trigger: "5"
    },
    {
      id: 5,
      message: "Reflect and celebrate",
      trigger: "6"
    },
    {
      id: 6,
      user: true,
      trigger: "7"
    },
    {
      id: 7,
      message: "Daily affirmations",
      trigger: "8"
    },
    {
      id: 8,
      user: true,
      trigger: "9"
    },
    {
      id: 9,
      message: "Thoughts and reflections",
      trigger: "10"
    },
    {
      id: 10,
      user: true,
      end: true
    },
  ]
)
