# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_01_21_195114) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "allowlisted_jwts", force: :cascade do |t|
    t.string "jti", null: false
    t.string "aud"
    t.datetime "exp", null: false
    t.bigint "user_id", null: false
    t.index ["jti"], name: "index_allowlisted_jwts_on_jti", unique: true
    t.index ["user_id"], name: "index_allowlisted_jwts_on_user_id"
  end

  create_table "annual_initiatives", force: :cascade do |t|
    t.bigint "created_by_id"
    t.bigint "owned_by_id"
    t.string "importance", default: [], array: true
    t.text "description"
    t.string "key_elements", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "company_id"
    t.string "context_description"
    t.integer "fiscal_year"
    t.date "closed_at"
    t.index ["company_id"], name: "index_annual_initiatives_on_company_id"
    t.index ["created_by_id"], name: "index_annual_initiatives_on_created_by_id"
    t.index ["owned_by_id"], name: "index_annual_initiatives_on_owned_by_id"
  end

  create_table "check_in_templates", force: :cascade do |t|
    t.string "name"
    t.integer "check_in_type"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "check_in_templates_steps", force: :cascade do |t|
    t.integer "step_type"
    t.integer "order_index"
    t.string "name"
    t.text "instructions"
    t.float "duration"
    t.string "component_to_render"
    t.bigint "check_in_template_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["check_in_template_id"], name: "index_check_in_templates_steps_on_check_in_template_id"
  end

  create_table "comments", force: :cascade do |t|
    t.bigint "annual_initiative_id", null: false
    t.bigint "created_by_id"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["annual_initiative_id"], name: "index_comments_on_annual_initiative_id"
    t.index ["created_by_id"], name: "index_comments_on_created_by_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.string "contact_email"
    t.string "phone_number"
    t.text "rallying_cry"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.date "fiscal_year_start"
    t.string "timezone"
    t.text "accountability_chart_embed"
    t.text "strategic_plan_embed"
    t.integer "display_format", default: 0
    t.integer "onboarding_status", default: 0
    t.string "customer_subscription_profile_id"
    t.integer "objectives_key_type", default: 1
    t.integer "forum_type", default: 0
  end

  create_table "company_static_data", force: :cascade do |t|
    t.string "field"
    t.text "value"
    t.bigint "company_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_company_static_data_on_company_id"
  end

  create_table "conversation_starters", force: :cascade do |t|
    t.string "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "core_fours", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_core_fours_on_company_id"
  end

  create_table "daily_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "log_date"
    t.integer "work_status", default: 4
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "create_my_day", default: false
    t.boolean "evening_reflection", default: false
    t.integer "mip_count"
    t.boolean "weekly_reflection", default: false
    t.index ["user_id"], name: "index_daily_logs_on_user_id"
  end

  create_table "default_admin_templates", force: :cascade do |t|
    t.string "title"
    t.integer "template_type"
    t.text "body"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "description_templates", force: :cascade do |t|
    t.string "title"
    t.integer "template_type"
    t.text "body"
    t.bigint "company_id", null: false
    t.datetime "created_at", precision: 6, default: -> { "now()" }, null: false
    t.datetime "updated_at", precision: 6, default: -> { "now()" }, null: false
    t.index ["company_id"], name: "index_description_templates_on_company_id"
  end

  create_table "habit_logs", force: :cascade do |t|
    t.date "log_date"
    t.bigint "habit_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["habit_id"], name: "index_habit_logs_on_habit_id"
  end

  create_table "habits", force: :cascade do |t|
    t.integer "frequency"
    t.string "name"
    t.string "color"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_habits_on_user_id"
  end

  create_table "issues", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "description"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "priority", default: 0
    t.bigint "team_id"
    t.integer "position"
    t.bigint "company_id"
    t.boolean "personal", default: false
    t.bigint "scheduled_group_id"
    t.index ["company_id"], name: "index_issues_on_company_id"
    t.index ["scheduled_group_id"], name: "index_issues_on_scheduled_group_id"
    t.index ["team_id"], name: "index_issues_on_team_id"
    t.index ["user_id", "position", "completed_at"], name: "index_issues_on_user_id_and_position_and_completed_at"
    t.index ["user_id"], name: "index_issues_on_user_id"
  end

  create_table "journal_entries", force: :cascade do |t|
    t.text "body"
    t.string "title"
    t.string "preview"
    t.string "generated_from_type"
    t.bigint "generated_from_id"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "logged_at"
    t.index ["generated_from_type", "generated_from_id"], name: "index_journal_entries_on_generated_from_polymorphic"
    t.index ["logged_at"], name: "index_journal_entries_on_logged_at"
    t.index ["user_id"], name: "index_journal_entries_on_user_id"
  end

  create_table "key_activities", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "description"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "weekly_list", default: false
    t.integer "priority", default: 0
    t.bigint "meeting_id"
    t.boolean "todays_priority", default: false
    t.integer "position"
    t.date "due_date"
    t.bigint "company_id"
    t.boolean "personal", default: false
    t.bigint "scheduled_group_id"
    t.bigint "team_id"
    t.date "moved_to_today_on"
    t.index ["company_id"], name: "index_key_activities_on_company_id"
    t.index ["completed_at", "position", "priority"], name: "index_key_activities_on_completed_at_and_position_and_priority"
    t.index ["created_at", "position", "priority"], name: "index_key_activities_on_created_at_and_position_and_priority"
    t.index ["due_date"], name: "index_key_activities_on_due_date"
    t.index ["meeting_id"], name: "index_key_activities_on_meeting_id"
    t.index ["scheduled_group_id"], name: "index_key_activities_on_scheduled_group_id"
    t.index ["team_id"], name: "index_key_activities_on_team_id"
    t.index ["user_id", "completed_at"], name: "index_key_activities_on_user_id_and_completed_at"
    t.index ["user_id", "created_at"], name: "index_key_activities_on_user_id_and_created_at"
    t.index ["user_id", "weekly_list", "todays_priority", "completed_at", "due_date", "created_at"], name: "index_key_activities_scoped_created_at_due_date"
    t.index ["user_id", "weekly_list", "todays_priority", "completed_at", "due_date", "priority"], name: "index_key_activities_scoped_priority_due_date"
    t.index ["user_id", "weekly_list", "todays_priority", "completed_at", "position"], name: "index_key_activities_scoped_position"
    t.index ["user_id", "weekly_list", "todays_priority", "completed_at", "priority"], name: "index_key_activities_scoped_priority"
    t.index ["user_id"], name: "index_key_activities_on_user_id"
  end

  create_table "key_elements", force: :cascade do |t|
    t.string "value"
    t.datetime "completed_at"
    t.string "elementable_type"
    t.bigint "elementable_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "completion_type"
    t.integer "completion_current_value"
    t.integer "completion_target_value"
    t.integer "completion_starting_value", default: 0
    t.integer "status", default: 0
    t.bigint "owned_by_id"
    t.integer "greater_than", default: 1
    t.index ["elementable_type", "elementable_id"], name: "index_key_elements_on_elementable_type_and_elementable_id"
    t.index ["owned_by_id"], name: "index_key_elements_on_owned_by_id"
  end

  create_table "key_performance_indicators", force: :cascade do |t|
    t.string "description"
    t.datetime "closed_at"
    t.bigint "created_by_id"
    t.bigint "user_id"
    t.bigint "company_id"
    t.bigint "team_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "unit_type"
    t.integer "target_value", default: 0
    t.boolean "is_deleted", default: false
    t.boolean "greater_than", default: true
    t.jsonb "viewers"
    t.bigint "owned_by_id"
    t.float "needs_attention_threshold"
    t.string "title"
    t.integer "parent_type"
    t.integer "parent_kpi", default: [], array: true
    t.index ["company_id"], name: "index_key_performance_indicators_on_company_id"
    t.index ["created_by_id"], name: "index_key_performance_indicators_on_created_by_id"
    t.index ["owned_by_id"], name: "index_key_performance_indicators_on_owned_by_id"
    t.index ["team_id"], name: "index_key_performance_indicators_on_team_id"
    t.index ["user_id"], name: "index_key_performance_indicators_on_user_id"
  end

  create_table "meeting_templates", force: :cascade do |t|
    t.string "name"
    t.integer "meeting_type"
    t.float "duration"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "description"
  end

  create_table "meetings", force: :cascade do |t|
    t.float "average_rating"
    t.integer "issues_done"
    t.integer "key_activities_done"
    t.float "average_team_mood"
    t.float "goal_progress"
    t.bigint "meeting_template_id", null: false
    t.bigint "team_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "start_time"
    t.integer "current_step"
    t.string "host_name"
    t.datetime "scheduled_start_time"
    t.datetime "end_time"
    t.bigint "hosted_by_id"
    t.text "notes", default: ""
    t.json "settings"
    t.boolean "original_creation", default: false
    t.index ["created_at"], name: "index_meetings_on_created_at"
    t.index ["hosted_by_id"], name: "index_meetings_on_hosted_by_id"
    t.index ["meeting_template_id"], name: "index_meetings_on_meeting_template_id"
    t.index ["start_time"], name: "index_meetings_on_start_time"
    t.index ["team_id"], name: "index_meetings_on_team_id"
  end

  create_table "milestones", force: :cascade do |t|
    t.bigint "created_by_id"
    t.text "description"
    t.integer "week"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.date "week_of"
    t.string "milestoneable_type"
    t.bigint "milestoneable_id"
    t.index ["created_by_id"], name: "index_milestones_on_created_by_id"
    t.index ["milestoneable_type", "milestoneable_id"], name: "index_milestones_on_milestoneable_type_and_milestoneable_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "notification_type"
    t.jsonb "rule"
    t.integer "method"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id", "notification_type"], name: "index_notifications_on_user_id_and_notification_type", unique: true
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "objective_logs", force: :cascade do |t|
    t.bigint "owned_by_id"
    t.string "objecteable_type"
    t.bigint "objecteable_id"
    t.integer "score"
    t.string "note"
    t.integer "fiscal_quarter"
    t.integer "fiscal_year"
    t.integer "week"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "child_id"
    t.string "child_type"
    t.integer "status", default: 0
    t.datetime "adjusted_date"
    t.index ["objecteable_type", "objecteable_id"], name: "index_objective_logs_on_objecteable"
    t.index ["owned_by_id"], name: "index_objective_logs_on_owned_by_id"
  end

  create_table "product_features", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "objective", default: true, null: false
    t.boolean "team", default: false, null: false
    t.boolean "meeting", default: false, null: false
    t.boolean "company", default: false, null: false
    t.boolean "pyns", default: false, null: false
    t.boolean "scorecard", default: false
    t.boolean "scorecard_pro", default: false
    t.boolean "check_in", default: true
    t.index ["user_id"], name: "index_product_features_on_user_id"
  end

  create_table "quarterly_goals", force: :cascade do |t|
    t.bigint "created_by_id"
    t.bigint "owned_by_id"
    t.bigint "annual_initiative_id", null: false
    t.string "importance", default: [], array: true
    t.text "description"
    t.string "key_elements", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "context_description"
    t.integer "quarter"
    t.date "closed_at"
    t.index ["annual_initiative_id"], name: "index_quarterly_goals_on_annual_initiative_id"
    t.index ["created_by_id"], name: "index_quarterly_goals_on_created_by_id"
    t.index ["owned_by_id"], name: "index_quarterly_goals_on_owned_by_id"
  end

  create_table "questionnaire_attempts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "questionnaire_id", null: false
    t.text "answers"
    t.text "steps"
    t.text "rendered_steps"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "json_representation"
    t.integer "emotion_score"
    t.string "questionnaire_type"
    t.string "questionnaire_attemptable_type"
    t.bigint "questionnaire_attemptable_id"
    t.index ["completed_at"], name: "index_questionnaire_attempts_on_completed_at"
    t.index ["questionnaire_attemptable_type", "questionnaire_attemptable_id"], name: "index_on_questionnaire_attemptable_id_and_type"
    t.index ["questionnaire_id"], name: "index_questionnaire_attempts_on_questionnaire_id"
    t.index ["user_id"], name: "index_questionnaire_attempts_on_user_id"
  end

  create_table "questionnaires", force: :cascade do |t|
    t.string "name"
    t.text "steps"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.integer "limit_type", default: 0
  end

  create_table "scheduled_groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "scorecard_logs", force: :cascade do |t|
    t.bigint "key_performance_indicator_id", null: false
    t.integer "score"
    t.string "note"
    t.integer "fiscal_quarter"
    t.integer "fiscal_year"
    t.integer "week"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["key_performance_indicator_id"], name: "index_scorecard_logs_on_key_performance_indicator_id"
    t.index ["user_id"], name: "index_scorecard_logs_on_user_id"
  end

  create_table "sign_up_purposes", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "purpose"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_sign_up_purposes_on_company_id"
  end

  create_table "static_data", force: :cascade do |t|
    t.string "field"
    t.text "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "steps", force: :cascade do |t|
    t.integer "step_type"
    t.integer "order_index"
    t.string "name"
    t.text "instructions"
    t.float "duration"
    t.string "component_to_render"
    t.bigint "meeting_template_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "link_embed"
    t.string "section_name"
    t.string "override_key"
    t.index ["meeting_template_id", "order_index"], name: "index_steps_on_meeting_template_id_and_order_index"
    t.index ["meeting_template_id"], name: "index_steps_on_meeting_template_id"
    t.index ["order_index"], name: "index_steps_on_order_index"
  end

  create_table "sub_initiatives", force: :cascade do |t|
    t.bigint "quarterly_goal_id", null: false
    t.bigint "created_by_id"
    t.bigint "owned_by_id"
    t.string "importance", default: [], array: true
    t.text "description"
    t.string "key_elements", default: [], array: true
    t.string "context_description"
    t.date "closed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_sub_initiatives_on_created_by_id"
    t.index ["owned_by_id"], name: "index_sub_initiatives_on_owned_by_id"
    t.index ["quarterly_goal_id"], name: "index_sub_initiatives_on_quarterly_goal_id"
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.bigint "team_id"
    t.bigint "user_id"
    t.bigint "company_id"
    t.index ["name", "company_id"], name: "index_tags_on_name_and_company_id", unique: true
    t.index ["name", "team_id"], name: "index_tags_on_name_and_team_id", unique: true
    t.index ["name", "user_id"], name: "index_tags_on_name_and_user_id", unique: true
  end

  create_table "team_issue_meeting_enablements", force: :cascade do |t|
    t.bigint "meeting_id", null: false
    t.bigint "team_issue_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["meeting_id"], name: "index_team_issue_meeting_enablements_on_meeting_id"
    t.index ["team_issue_id"], name: "index_team_issue_meeting_enablements_on_team_issue_id"
  end

  create_table "team_issues", force: :cascade do |t|
    t.bigint "issue_id"
    t.bigint "team_id"
    t.integer "position"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["issue_id"], name: "index_team_issues_on_issue_id"
    t.index ["team_id", "position", "completed_at", "issue_id"], name: "index_team_issues_sort_with_issue_id"
    t.index ["team_id", "position", "completed_at"], name: "index_team_issues_on_team_id_and_position_and_completed_at"
    t.index ["team_id"], name: "index_team_issues_on_team_id"
  end

  create_table "team_user_enablements", force: :cascade do |t|
    t.bigint "team_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "role", default: 0
    t.boolean "team_manager", default: false
    t.index ["team_id"], name: "index_team_user_enablements_on_team_id"
    t.index ["user_id"], name: "index_team_user_enablements_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "default_avatar_color"
    t.json "settings", default: {}
    t.integer "executive", default: 0
    t.boolean "custom_scorecard", default: false
    t.boolean "deleted", default: false
    t.index ["company_id"], name: "index_teams_on_company_id"
  end

  create_table "user_company_enablements", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_role_id"
    t.string "user_title"
    t.boolean "first_time_access", default: true
    t.index ["company_id"], name: "index_user_company_enablements_on_company_id"
    t.index ["user_id"], name: "index_user_company_enablements_on_user_id"
    t.index ["user_role_id"], name: "index_user_company_enablements_on_user_role_id"
  end

  create_table "user_pulses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "score"
    t.string "feeling", default: ""
    t.date "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_pulses_on_user_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.string "invited_by_type"
    t.bigint "invited_by_id"
    t.integer "invitations_count", default: 0
    t.text "personal_vision"
    t.bigint "company_id"
    t.string "timezone"
    t.bigint "user_role_id"
    t.string "default_avatar_color"
    t.string "title"
    t.datetime "deleted_at"
    t.bigint "default_selected_company_id"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["default_selected_company_id"], name: "index_users_on_default_selected_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["user_role_id"], name: "index_users_on_user_role_id"
  end

  create_table "versions", force: :cascade do |t|
    t.string "item_type", null: false
    t.bigint "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.text "object_changes"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "allowlisted_jwts", "users", on_delete: :cascade
  add_foreign_key "annual_initiatives", "companies"
  add_foreign_key "check_in_templates_steps", "check_in_templates"
  add_foreign_key "comments", "annual_initiatives"
  add_foreign_key "company_static_data", "companies"
  add_foreign_key "core_fours", "companies"
  add_foreign_key "daily_logs", "users"
  add_foreign_key "description_templates", "companies"
  add_foreign_key "habit_logs", "habits"
  add_foreign_key "habits", "users"
  add_foreign_key "issues", "companies"
  add_foreign_key "issues", "users"
  add_foreign_key "journal_entries", "users"
  add_foreign_key "key_activities", "companies"
  add_foreign_key "key_activities", "meetings"
  add_foreign_key "key_activities", "users"
  add_foreign_key "key_performance_indicators", "companies"
  add_foreign_key "key_performance_indicators", "teams"
  add_foreign_key "key_performance_indicators", "users"
  add_foreign_key "meetings", "meeting_templates"
  add_foreign_key "meetings", "teams"
  add_foreign_key "meetings", "users", column: "hosted_by_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "product_features", "users"
  add_foreign_key "quarterly_goals", "annual_initiatives"
  add_foreign_key "questionnaire_attempts", "questionnaires"
  add_foreign_key "questionnaire_attempts", "users"
  add_foreign_key "scorecard_logs", "key_performance_indicators"
  add_foreign_key "scorecard_logs", "users"
  add_foreign_key "sign_up_purposes", "companies"
  add_foreign_key "steps", "meeting_templates"
  add_foreign_key "sub_initiatives", "quarterly_goals"
  add_foreign_key "taggings", "tags"
  add_foreign_key "tags", "companies"
  add_foreign_key "tags", "teams"
  add_foreign_key "tags", "users"
  add_foreign_key "team_issue_meeting_enablements", "meetings"
  add_foreign_key "team_issue_meeting_enablements", "team_issues"
  add_foreign_key "team_user_enablements", "teams"
  add_foreign_key "team_user_enablements", "users"
  add_foreign_key "teams", "companies"
  add_foreign_key "user_company_enablements", "companies"
  add_foreign_key "user_company_enablements", "user_roles"
  add_foreign_key "user_company_enablements", "users"
  add_foreign_key "user_pulses", "users"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "companies", column: "default_selected_company_id"
  add_foreign_key "users", "user_roles"
end
