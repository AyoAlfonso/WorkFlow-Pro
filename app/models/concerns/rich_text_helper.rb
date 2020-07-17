module RichTextHelper
  extend ActiveSupport::Concern

  #https://api.rubyonrails.org/classes/ActiveModel/Serialization.html#method-i-serializable_hash
  module ClassMethods
    def rich_text_content_render(*field_names)
      field_names.each do |field_name|
        define_method("#{field_name}_content") do
          self.send(field_name).try(:body).to_s
        end
      end
    end
  end
end