require 'rollbar/logger'

Rails.logger.extend(ActiveSupport::Logger.broadcast(Rollbar::Logger.new))