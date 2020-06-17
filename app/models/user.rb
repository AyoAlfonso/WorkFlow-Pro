class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :confirmable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable
  
  has_one :company
  has_many :issues
  has_many :key_activities
  has_many :personal_reflections
  has_many :quarterly_goals, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :annual_initiatives, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :weekly_meetings, :foreign_key => 'created_by_id', :class_name => 'User'
  has_many :meeting_ratings
end
