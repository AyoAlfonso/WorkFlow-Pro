# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_27_173155) do

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
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
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
    t.index ["company_id"], name: "index_annual_initiatives_on_company_id"
    t.index ["created_by_id"], name: "index_annual_initiatives_on_created_by_id"
    t.index ["owned_by_id"], name: "index_annual_initiatives_on_owned_by_id"
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
  end

  create_table "conversation_starters", force: :cascade do |t|
    t.string "title"
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

  create_table "create_my_days", force: :cascade do |t|
    t.text "i_am_grateful_for"
    t.text "how_do_i_want_to_feel"
    t.string "frog_type"
    t.integer "frog_id"
    t.text "daily_affirmation"
    t.text "thoughts_and_reflections"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "daily_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "log_date"
    t.integer "work_status", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_daily_logs_on_user_id"
  end

  create_table "issues", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "description"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "priority", default: 0
    t.index ["user_id"], name: "index_issues_on_user_id"
  end

  create_table "key_activities", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "description"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "complete"
    t.boolean "weekly_list"
    t.integer "priority", default: 0
    t.index ["user_id"], name: "index_key_activities_on_user_id"
  end

  create_table "key_elements", force: :cascade do |t|
    t.string "value"
    t.datetime "completed_at"
    t.string "elementable_type"
    t.bigint "elementable_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["elementable_type", "elementable_id"], name: "index_key_elements_on_elementable_type_and_elementable_id"
  end

  create_table "meeting_ratings", force: :cascade do |t|
    t.float "score"
    t.bigint "user_id", null: false
    t.bigint "weekly_meeting_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_meeting_ratings_on_user_id"
    t.index ["weekly_meeting_id"], name: "index_meeting_ratings_on_weekly_meeting_id"
  end

  create_table "milestones", force: :cascade do |t|
    t.bigint "created_by_id"
    t.bigint "quarterly_goal_id", null: false
    t.text "description"
    t.integer "week"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.date "week_of"
    t.index ["created_by_id"], name: "index_milestones_on_created_by_id"
    t.index ["quarterly_goal_id"], name: "index_milestones_on_quarterly_goal_id"
  end

  create_table "personal_reflections", force: :cascade do |t|
    t.string "how_are_you_feeling"
    t.text "what_do_you_feel"
    t.text "reflect_and_celebrate"
    t.text "daily_affirmations"
    t.text "thoughts_and_reflections"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.integer "status", default: 0
    t.string "context_description"
    t.integer "quarter"
    t.index ["annual_initiative_id"], name: "index_quarterly_goals_on_annual_initiative_id"
    t.index ["created_by_id"], name: "index_quarterly_goals_on_created_by_id"
    t.index ["owned_by_id"], name: "index_quarterly_goals_on_owned_by_id"
  end

  create_table "thought_challenges", force: :cascade do |t|
    t.text "negative_thoughts"
    t.integer "cognitive_distortions", default: 0
    t.text "how_to_challenge_negative_thoughts"
    t.text "another_way_to_interpret"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.bigint "company_id", null: false
    t.string "timezone"
    t.bigint "user_role_id"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["invited_by_type", "invited_by_id"], name: "index_users_on_invited_by_type_and_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["user_role_id"], name: "index_users_on_user_role_id"
  end

  create_table "weekly_meetings", force: :cascade do |t|
    t.bigint "created_by_id"
    t.string "emotions_img"
    t.integer "conversation_starter_id"
    t.float "average_rating"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_weekly_meetings_on_created_by_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "allowlisted_jwts", "users", on_delete: :cascade
  add_foreign_key "annual_initiatives", "companies"
  add_foreign_key "comments", "annual_initiatives"
  add_foreign_key "core_fours", "companies"
  add_foreign_key "daily_logs", "users"
  add_foreign_key "issues", "users"
  add_foreign_key "key_activities", "users"
  add_foreign_key "meeting_ratings", "users"
  add_foreign_key "meeting_ratings", "weekly_meetings"
  add_foreign_key "milestones", "quarterly_goals"
  add_foreign_key "quarterly_goals", "annual_initiatives"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "user_roles"
end
