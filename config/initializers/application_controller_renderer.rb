# Be sure to restart your server when you modify this file.

# ActiveSupport::Reloader.to_prepare do
#   ApplicationController.renderer.defaults.merge!(
#     http_host: 'example.org',
#     https: false
#   )
# end

ActionController::Renderer.const_set('DEFAULTS', {
    http_host: ENV["HOST_URL"],
    https: false,
    method: "get",
    script_name: "",
    input: ""
  }.freeze
)
