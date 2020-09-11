require 'roo'

class DataSeedingService
  attr_accessor :logOutput
  attr_accessor :errors_summary

  def initialize(file, logOutput = false)
    @logOutput = logOutput
    #DataSeedingService.new(Dir["db/seeds/files/dnd_seeding.xlsx"].first, true).load_data
    @file = file
    @errors_summary = []
  end

  def load_data
    begin
      xlsx = Roo::Spreadsheet.open(@file, extension: :xlsx, csv_options: {internal_encoding: Encoding::UTF_8, external_encoding: Encoding::ISO_8859_1}) 
      import_content(xlsx, [])
    rescue StandardError => e
      puts "**** ERROR ****, #{e}"
      return
    end
  end

  def load_data_for_table(table_name)
    # DataSeedingService.new(Dir["db/seeds/files/lynchpyn_seeding_v1.xlsx"].first, true).load_data_for_table("TeamUserEnablement")
    begin
      xlsx = Roo::Spreadsheet.open(@file, extension: :xlsx)
      import_content(xlsx, [], [table_name])
    rescue StandardError => e
      puts "**** ERROR ****, #{e}"
      return
    end
  end

  def import_content(xlsx, exclude_table, include_table = [])
    xlsx.each_with_pagename do |table_name, sheet|
      begin
        next if sheet.row(1)[1] == "skip"
        puts "--skipping import of #{table_name}" if @logOutput && (exclude_table.include?(table_name))
        next if (exclude_table.include?(table_name))
        puts "--skipping import of #{table_name}" if @logOutput && (include_table.present? && !include_table.include?(table_name))
        next if (include_table.present? && !include_table.include?(table_name))

        puts "--starting import of #{table_name}" if @logOutput
        db_fields = []
        keys = []

        sheet.drop(2).each_with_index do |row, index|
          case row.first
          when "TableName"
            break
          when "Common Name"
            break
          when "DB Name"
            db_fields = row.drop(1)
          when "Key"
            keys = row.drop(1)
          else
            if table_name == "TeamUserEnablement"
              search_for_team_user_enablements(table_name, db_fields, keys, row.drop(1)) if db_fields.present?
            else
              create_or_update_record(table_name, db_fields, keys, row.drop(1), index) if db_fields.present?
            end
            puts "importing record #{index}" if @logOutput
          end
        end
        puts "--import complete of #{table_name}" if @logOutput
      rescue StandardError => e
        puts "-- ERROR ON TABLE_NAME #{table_name}" if @logOutput
        puts "***** ERROR *****, #{e}"
      end
    end

    if !@errors_summary.blank?
      errors_summary.each{|error| puts error}
      # @errors_summary = []
    end
  end

  private

  def create_or_update_record(table_name, fields, keys, data, row_number)
    search_hash = {}
    attributes_hash = {}
    multi_fk = {}

    keys.each_with_index do |key, index|
      next if key.blank?
      if key == 'pk'
        search_hash[fields[index]] = data[index]
      elsif key == 'fk'
        if data[index].present?
          associate_record = find_associate_record_by_name(fields[index], data[index])
          search_hash[fields[index]] = associate_record.id if associate_record.present?
          if associate_record.blank?
            errors_summary << "#{table_name} not able to find record for #{data[index]} on row: #{row_number} from #{data.inspect}"
            return
          end
        end
      end
    end

    if table_name == "User"
      search_hash.each{|key, value| value.downcase! if key == 'email'}
    end

    record = table_name.classify.constantize.where(search_hash).first_or_initialize
    fields.reject.each_with_index{|e, i| e.to_s.empty? || keys[i] == 'skip' }.map{|elem| elem.to_sym}.each do |field|
      index = fields.find_index("#{field}")

      if field.to_s.last(3) == '_id'
        if data[index].present?
          association_record = find_associate_record_by_name(field, data[index])
          attributes_hash[field] = association_record.id if association_record.present?
        end
      else
        if record.column_for_attribute(field).type == :boolean
          attributes_hash[field] = data[index] == 'Y' ? true : false
        elsif record.column_for_attribute(field).type == :integer
          attributes_hash[field] = data[index].to_i
        else
          attributes_hash[field] = data[index] if record.attributes.keys.include? field.to_s
          if table_name == "User" && field.to_s == "password"
            if data[index].present?
              attributes_hash[:password] = data[index]
            else
              attributes_hash[:password] = "password"
            end
          end
        end
      end
    end

    if table_name == "User"
      attributes_hash[:confirmed_at] = Time.now
    end

    record.update!(attributes_hash)
  end


  def search_for_team_user_enablements(table_name, fields, keys, data)
    search_hash = {}

    keys.each_with_index do |key, index|
      if data[index].present?
        if fields[index] == "user_id"
          associate_record = User.find_by_email(data[index])
        else
          associate_record = find_associate_record_by_name(fields[index], data[index])
        end
        search_hash[fields[index]] = associate_record.id if associate_record.present?
      end
    end

    if TeamUserEnablement.where(search_hash).blank?
      TeamUserEnablement.create!(search_hash)
    end
  end

  def find_associate_record_by_name(field, data)
    record_field = field.to_s.chomp('_id')
    record_class = record_field.classify.constantize
    record_class.find_by_name(data)
  end
end
