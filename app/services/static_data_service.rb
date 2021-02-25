class StaticDataService < ApplicationService

  def call
    { "time_zones": time_zones }
  end

  def time_zones
    time_zones = []
    ActiveSupport::TimeZone.all.uniq(&:utc_offset).sort.each { |tz|
      time_zones.push({name: "#{tz.name}, UTC #{tz.formatted_offset.to_s}", offset: tz.utc_offset})
    }
    time_zones
  end
end