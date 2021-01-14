class LabelPolicy < ApplicationPolicy
  attr_reader :user, :label
  
  def initialize(user, label)
    @user = user
    @label = label
  end
  
  def index?
    true
  end
end