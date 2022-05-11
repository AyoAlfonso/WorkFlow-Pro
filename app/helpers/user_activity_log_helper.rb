module UserActivityLogHelper
    
  def record_activity(note, controller=nil)
      controller_name = controller if controller.present?
      @activity = UserActivityLog.new
      @activity.user = current_user
      @activity.note = note
      @activity.browser = request.env['HTTP_USER_AGENT']
      @activity.ip_address = request.env['REMOTE_ADDR']
      @activity.controller = controller_name 
      @activity.action = action_name 
      @activity.company = current_company
      @activity.params = params.inspect
      @activity.save
  end

end
