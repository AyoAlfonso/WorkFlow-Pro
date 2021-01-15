class Api::LabelsController < Api::ApplicationController
  
  respond_to :json

  def index
    @labels = policy_scope(ActsAsTaggableOn::Tag, policy_scope_class: LabelPolicy::Scope).order('created_at DESC')
    render "api/labels/index"
  end

end
