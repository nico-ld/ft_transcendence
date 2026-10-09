ROLES := software-engineer accountant data-analyst devops-engineer technical-writer

.PHONY: images base $(ROLES) clean-images

images: $(ROLES)

base:
	docker build -t workspace-base base

$(ROLES): base
	docker build -t workspace-$@ roles/$@

clean-images:
	-docker rmi $(addprefix workspace-,$(ROLES)) workspace-base
