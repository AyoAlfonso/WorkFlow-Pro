class LabelsController < ApplicationController
  
  def index
    labels = policy_scope(label_class.order(:name))
    render :json labels, each_serializer: label_serializer
  end

  private 
    def label_class
      ActsAsTaggableOn::Label
    end

    def label_serializer
      LabelSerializer
    end
end
