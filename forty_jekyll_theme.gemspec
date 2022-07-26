# coding: utf-8

Gem::Specification.new do |spec|
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|_sass)}i) }

  spec.add_development_dependency "jekyll", "~> 4.0"
  spec.add_development_dependency "bundler", "~> 2.2"
end
