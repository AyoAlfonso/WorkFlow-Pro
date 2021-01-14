class LabelsController < ApplicationController
  
  def index
    labels = policy_scope(label_class.order('created_at DESC'))
    render :json labels, each_serializer: label_serializer
  end

  private 
    def label_class
      ActsAsTaggableOn::Tag
    end

    def label_serializer
      LabelSerializer
    end
end
