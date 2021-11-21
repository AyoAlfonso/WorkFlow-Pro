module ActiveRecordScope
  def self.included(base)
    base.scope :not_deleted, -> { base.where(deleted: false) }
    base.send(:default_scope) { base.not_deleted }
    base.scope :only_deleted, -> { base.unscope(where: :deleted).where(deleted: true) }

    def soft_delete
      self.update(deleted: true)
    end

    def undelete
      self.update(deleted: false)
    end
  end
end