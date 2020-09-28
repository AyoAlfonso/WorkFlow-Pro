web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -t 25 -c 10 -q default -q active_storage_purge -q active_storage_analysis
