# ActsAsTaggableOn::Tag.class_eval do
#   validates :name, uniqueness: { scope: :team_id }

#   def validates_name_uniqueness?
#     false
#   end

# end

# ActsAsTaggableOn::Tag.instance_eval do
#   def find_or_create_all_with_like_by_name_and_context(*list, _context)
#     list = Array(list).flatten
#     return [] if list.empty?

#     list.map do |tag_name|
#       begin
#         tries ||= 3

#         existing_tags = named_any(list).where(team_id: _context)
#         comparable_tag_name = comparable_name(tag_name)
#         existing_tag = existing_tags.find { |tag| comparable_name(tag.name) == comparable_tag_name }
#         existing_tag || create(name: tag_name, team_id: _context)
#       rescue ActiveRecord::RecordNotUnique
#         if (tries -= 1).positive?
#           ActiveRecord::Base.connection.execute 'ROLLBACK'
#           retry
#         end

#         raise DuplicateTagError.new("'#{tag_name}' has already been taken")
#       end
#     end
#   end
# end

# ActsAsTaggableOn::Taggable.module_eval do
#   module Core
#     def load_tags(tag_list, _context)
#       ActsAsTaggableOn::Tag.find_or_create_all_with_like_by_name_and_context(tag_list, _context)
#     end

#     private

#     def find_or_create_tags_from_list_with_context(tag_list, _context)
#       load_tags(tag_list, _context)
#     end
#   end
# end