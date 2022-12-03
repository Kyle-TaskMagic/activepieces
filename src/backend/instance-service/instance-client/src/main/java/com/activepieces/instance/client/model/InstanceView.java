package com.activepieces.instance.client.model;

import com.activepieces.common.EntityMetadata;
import com.activepieces.entity.enums.InstanceStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.ksuid.Ksuid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Map;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
public class InstanceView implements EntityMetadata {

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private Ksuid id;

  @JsonProperty private Ksuid projectId;

  @JsonProperty private Ksuid collectionVersionId;

  @JsonProperty private Map<String, Object> configs;

  @JsonProperty private InstanceStatus status;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private long epochCreationTime;

  @JsonProperty(access = JsonProperty.Access.READ_ONLY)
  private long epochUpdateTime;
}