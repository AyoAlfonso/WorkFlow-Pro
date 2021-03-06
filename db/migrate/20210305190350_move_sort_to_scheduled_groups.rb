class MoveSortToScheduledGroups < ActiveRecord::Migration[6.0]
  def change
  end
  
  def data
    #major possibly breaking change here.  We want to redo all our sorting to use scheduled groups instead.  Scoping based on true /false flags is getting out of hand.
    #TODO: should we separate a group for "Completed" that does not belong in the backlog?

    #SQL should execute to insert groups if they do not exist.
    ["Today", "Tomorrow", "Weekly List", "Backlog"].each do |group|

      st1 = ActiveRecord::Base.connection.execute("SELECT * FROM scheduled_groups WHERE scheduled_groups.name = '#{group}' ORDER BY scheduled_groups.id ASC LIMIT 1")
      # st1 = ActiveRecord::Base.connection.exec_query(`SELECT "scheduled_groups".* FROM "scheduled_groups" WHERE "scheduled_groups"."name" = $1 ORDER BY "scheduled_groups"."id" ASC LIMIT $2`, 'SQL', [["name", group], ["LIMIT", 1]])

      #if there is no result
      if st1.first.blank?
        ts = DateTime.now
        st2 = ActiveRecord::Base.connection.execute("INSERT INTO scheduled_groups (name, created_at, updated_at) VALUES ('#{group}', '#{ts}','#{ts}') RETURNING 'id'")
        # st2 = ActiveRecord::Base.connection.exec_query(`
        # INSERT INTO "scheduled_groups" ("name", "created_at", "updated_at") VALUES ($1, $2, $3) RETURNING "id`, 'SQL', [["name", group], ["created_at", ts], ["updated_at", ts]])
      end
    end

    #this should only run if scheduled groups has been created
    Company.all.each do |company|
      company.users.each do |user|

        sch1 = ActiveRecord::Base.connection.execute("SELECT * FROM scheduled_groups WHERE scheduled_groups.name = 'Today' ORDER BY scheduled_groups.id ASC LIMIT 1")

        if sch1.first.try(:[], "id").present?
          ActiveRecord::Base.connection.execute("UPDATE key_activities SET scheduled_group_id = #{sch1.first["id"]} WHERE key_activities.company_id = #{company.id} AND key_activities.user_id = #{user.id} AND key_activities.todays_priority = '1'")
        end
  
        sch2 = ActiveRecord::Base.connection.execute("SELECT * FROM scheduled_groups WHERE scheduled_groups.name = 'Weekly List' ORDER BY scheduled_groups.id ASC LIMIT 1")

        if sch2.first.try(:[], "id").present?
          ActiveRecord::Base.connection.execute("UPDATE key_activities SET scheduled_group_id = #{sch2.first["id"]} WHERE key_activities.company_id = #{company.id} AND key_activities.user_id = #{user.id} AND key_activities.weekly_list = '1'")
        end

        sch3 = ActiveRecord::Base.connection.execute("SELECT * FROM scheduled_groups WHERE scheduled_groups.name = 'Backlog' ORDER BY scheduled_groups.id ASC LIMIT 1")

        if sch3.first.try(:[], "id").present?
          ActiveRecord::Base.connection.execute("UPDATE key_activities SET scheduled_group_id = #{sch3.first["id"]} WHERE key_activities.company_id = #{company.id} AND key_activities.user_id = #{user.id} AND key_activities.todays_priority != '1' AND key_activities.weekly_list != '1'")
        end
      end
    end

        #Source, to remove data

        # ActiveRecord::Base.connection.exec_query(`UPDATE "key_activities" SET "scheduled_group_id" = $1 WHERE "key_activities"."company_id" = $2 AND "key_activities"."user_id" = $3 AND "key_activities"."todays_priority" = $4`, 'SQL',[["scheduled_group_id", sch1.id], ["company_id", company.id], ["user_id", user.id], ["todays_priority", true]])

        # ActiveRecord::Base.connection.exec_query(`UPDATE "key_activities" SET "scheduled_group_id" = $1 WHERE "key_activities"."company_id" = $2 AND "key_activities"."user_id" = $3 AND "key_activities"."weekly_list" = $4`, 'SQL', [["scheduled_group_id", sch2.id], ["company_id", company.id], ["user_id", user.id], ["weekly_list", true]]

        # ActiveRecord::Base.connection.exec_query(`UPDATE "key_activities" SET "scheduled_group_id" = $1 WHERE "key_activities"."company_id" = $2 AND  "key_activities"."user_id" = $3 AND "key_activities"."weekly_list" = $4 AND "key_activities"."todays_priority" = $5`, 'SQL', [["scheduled_group_id", sch3.id], ["company_id", company.id], ["user_id", user.id], ["weekly_list", false], ["todays_priority", false]]


        # KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(todays_priority: true).update_all(scheduled_group_id: ScheduledGroup.find_by_name("Today").id)

        # KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(weekly_list: true).update_all(scheduled_group_id: ScheduledGroup.find_by_name("Weekly List").id)

        # KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(weekly_list: false).where(todays_priority: false).update_all(scheduled_group_id: ScheduledGroup.find_by_name("Backlog").id)
  end

    #TEST IF DATA IS ACCURATE

    # @results1 = {}
    # Company.all.each do |company|
    #   company.users.each do |user|
    #     @results1["c#{company.id}-u#{user.id}"] = {
    #       today: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(todays_priority: true).map{|ka| {id: ka.id, position: ka.position}},
    #       tomorrow: [],
    #       weekly: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(weekly_list: true).map{|ka| {id: ka.id, position: ka.position}},
    #       backlog: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(weekly_list: false).where(todays_priority: false).map{|ka| {id: ka.id, position: ka.position}},
    #     }
    #   end
    # end
    # @results2 = {}
    # Company.all.each do |company|
    #   company.users.each do |user|
    #     @results2["c#{company.id}-u#{user.id}"] = {
    #       today: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(scheduled_group_id: ScheduledGroup.find_by_name("Today").id).map{|ka| {id: ka.id, position: ka.position}},
    #       tomorrow: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(scheduled_group_id: ScheduledGroup.find_by_name("Tomorrow").id).map{|ka| {id: ka.id, position: ka.position}},
    #       weekly: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(scheduled_group_id: ScheduledGroup.find_by_name("Weekly List").id).map{|ka| {id: ka.id, position: ka.position}},
    #       backlog: KeyActivity.optimized.user_current_company(company.id).owned_by_self_or_team_members(user).owned_by_user(user).where(scheduled_group_id: ScheduledGroup.find_by_name("Backlog").id).map{|ka| {id: ka.id, position: ka.position}},
    #     }
    #   end
    # end
    # # puts @results1.inspect
    # # puts @results2.inspect
    # puts @results1 == @results2 ? "Successful migration" : "migration out of order"
    

end
